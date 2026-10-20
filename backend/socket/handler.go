package socket

import (
	"backend/repository"
	"log"

	"github.com/zishang520/socket.io/v2/socket"
)

func SetupSocketServer() *socket.Server {
	opt := socket.DefaultServerOptions()
	io := socket.NewServer(nil, opt)

	// Define events
	io.On("connection", func(clients ...any) {
		client := clients[0].(*socket.Socket)
		log.Println("Client connected:", client.Id())

		client.On("join", func(args ...any) {
			if len(args) > 0 {
				room, ok := args[0].(string)
				if ok {
					client.Join(socket.Room(room))
					log.Println("Client joined room:", room)

					// Load history from DB
					history, err := repository.GetChatHistory(room)
					if err != nil {
						log.Println("Error fetching history:", err)
						return
					}

					// Emit history to the joining client
					client.Emit("history", history)
				}
			}
		})

		client.On("message", func(args ...any) {
			if len(args) > 0 {
				// Expecting an object: { text: string, socketId: string, roomId: string, sender: string }
				data, ok := args[0].(map[string]interface{})
				if !ok {
					log.Println("Invalid message format")
					return
				}

				text, _ := data["text"].(string)
				roomId, _ := data["roomId"].(string)
				sender, _ := data["sender"].(string) // "user" or "admin"

				if roomId == "" || text == "" {
					return
				}

				if sender == "" {
					sender = "user" // Default to user if not specified
				}

				log.Println("Message received in room", roomId, ":", text)

				// Save to DB
				msg, err := repository.SaveMessage(roomId, sender, text)
				if err != nil {
					log.Println("Error saving message:", err)
					return
				}
				log.Println("Message saved to DB with ID:", msg.ID)

				// Broadcast to room
				io.To(socket.Room(roomId)).Emit("message", msg)
			}
		})

		client.On("disconnect", func(args ...any) {
			log.Println("Client disconnected:", client.Id())
		})
	})

	return io
}
