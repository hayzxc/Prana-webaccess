package models

import "time"

type ChatMessage struct {
	ID                    string    `json:"id"`
	ConsultationRequestId string    `json:"consultationRequestId"`
	Sender                string    `json:"sender"`
	Message               string    `json:"message"`
	CreatedAt             time.Time `json:"createdAt"`
}
