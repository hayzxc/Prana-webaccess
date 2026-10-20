package controllers

import (
	"backend/repository"

	"github.com/gofiber/fiber/v2"
)

func GetConversations(c *fiber.Ctx) error {
	conversations, err := repository.GetConversations()
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	return c.JSON(conversations)
}

func GetChatHistory(c *fiber.Ctx) error {
	roomID := c.Params("roomId")
	if roomID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "roomId is required"})
	}

	history, err := repository.GetChatHistory(roomID)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(history)
}
