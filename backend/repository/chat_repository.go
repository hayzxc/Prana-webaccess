package repository

import (
	"backend/db"
	"backend/models"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)

func GetChatHistory(roomId string) ([]models.ChatMessage, error) {
	rows, err := db.Pool.Query(context.Background(),
		"SELECT id, consultation_request_id, sender, message, \"createdAt\" FROM chat_messages WHERE consultation_request_id = $1 ORDER BY \"createdAt\" ASC",
		roomId)
	if err != nil {
		return nil, fmt.Errorf("error fetching history: %v", err)
	}
	defer rows.Close()

	history := make([]models.ChatMessage, 0)
	for rows.Next() {
		var msg models.ChatMessage
		if err := rows.Scan(&msg.ID, &msg.ConsultationRequestId, &msg.Sender, &msg.Message, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		history = append(history, msg)
	}
	return history, nil
}

func SaveMessage(roomId, sender, message string) (*models.ChatMessage, error) {
	id := uuid.NewString()
	var createdAt time.Time
	err := db.Pool.QueryRow(context.Background(),
		"INSERT INTO chat_messages (id, consultation_request_id, sender, message, \"createdAt\") VALUES ($1, $2, $3, $4, NOW()) RETURNING \"createdAt\"",
		id, roomId, sender, message).Scan(&createdAt)

	if err != nil {
		return nil, fmt.Errorf("error saving message: %v", err)
	}

	return &models.ChatMessage{
		ID:                    id,
		ConsultationRequestId: roomId,
		Sender:                sender,
		Message:               message,
		CreatedAt:             createdAt,
	}, nil
}

func GetConversations() ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(context.Background(),
		`SELECT DISTINCT ON (m.consultation_request_id) 
			m.consultation_request_id, 
			m.message, 
			m."createdAt",
			COALESCE(
				NULLIF(u.name, ''),
				NULLIF(u.email, ''),
				CASE
					WHEN LENGTH(m.consultation_request_id) > 8
						THEN 'Guest ' || LEFT(m.consultation_request_id, 8) || '...'
					ELSE 'Guest ' || m.consultation_request_id
				END
			) AS display_name
		 FROM chat_messages m
		 LEFT JOIN users u ON u.id = m.consultation_request_id
		 ORDER BY m.consultation_request_id, m."createdAt" DESC`)
	if err != nil {
		return nil, fmt.Errorf("error fetching conversations: %v", err)
	}
	defer rows.Close()

	conversations := make([]map[string]interface{}, 0)
	count := 0
	for rows.Next() {
		var id, message, displayName string
		var createdAt time.Time

		if err := rows.Scan(&id, &message, &createdAt, &displayName); err != nil {
			continue
		}

		conversations = append(conversations, map[string]interface{}{
			"id":          id,
			"lastMessage": message,
			"lastActive":  createdAt,
			"name":        displayName,
		})
		count++
	}

	// Debug: log the number of conversations returned
	if count == 0 {
		log.Println("GetConversations: no conversations found")
	} else {
		log.Printf("GetConversations: found %d conversations\n", count)
	}

	return conversations, nil
}
