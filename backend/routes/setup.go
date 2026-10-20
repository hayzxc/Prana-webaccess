package routes

import (
	"backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/chats", controllers.GetConversations)
	api.Get("/chats/:roomId", controllers.GetChatHistory)
}
