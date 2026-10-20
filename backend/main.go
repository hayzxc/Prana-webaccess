package main

import (
	"backend/db"
	"backend/routes"
	"backend/socket"
	"log"
	"os"

	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Debug: Check env before load
	log.Println("Env DATABASE_URL before load:", os.Getenv("DATABASE_URL"))

	// Load .env file (for local development)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env in current dir, trying parent...")
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("Warning: .env file not found (this is OK in production)")
		}
	}

	// Connect to Database
	if err := db.Connect(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize Fiber
	app := fiber.New()

	// Get allowed origins from environment (comma-separated for multiple)
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	// Configure CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     "GET,POST,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	// Setup HTTP Routes
	routes.SetupRoutes(app)

	// Initialize Socket.IO and mount it on Fiber
	io := socket.SetupSocketServer()

	// Mount Socket.IO handler at /socket.io path
	app.Use("/socket.io", adaptor.HTTPHandler(io.ServeHandler(nil)))

	// Basic health check route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Backend Fiber Chat Running (Refactored)")
	})

	// Get port from environment (Railway sets PORT automatically)
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001" // Default for local development
	}

	log.Printf("Server listening on :%s", port)
	log.Fatal(app.Listen(":" + port))
}
