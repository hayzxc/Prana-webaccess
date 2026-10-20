package db

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() error {
	databaseUrl := os.Getenv("DIRECT_DATABASE_URL")
	if databaseUrl == "" {
		databaseUrl = os.Getenv("DATABASE_URL")
	}
	if databaseUrl == "" {
		return fmt.Errorf("DIRECT_DATABASE_URL or DATABASE_URL is not set")
	}

	if strings.HasPrefix(databaseUrl, "prisma+postgres://") {
		return fmt.Errorf("Go backend requires a direct PostgreSQL connection string; set DIRECT_DATABASE_URL to a postgres:// or postgresql:// URL instead of Prisma Accelerate")
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), databaseUrl)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := Pool.Ping(ctx); err != nil {
		return fmt.Errorf("unable to ping database: %v", err)
	}

	if err := ensureSchema(ctx); err != nil {
		return err
	}

	return nil
}

func Close() {
	if Pool != nil {
		Pool.Close()
	}
}

func ensureSchema(ctx context.Context) error {
	_, err := Pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS chat_messages (
			id TEXT PRIMARY KEY,
			consultation_request_id TEXT NOT NULL,
			sender TEXT NOT NULL,
			message TEXT NOT NULL,
			"createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		CREATE INDEX IF NOT EXISTS chat_messages_room_created_at_idx
			ON chat_messages (consultation_request_id, "createdAt");
	`)
	if err != nil {
		return fmt.Errorf("unable to ensure chat schema: %v", err)
	}

	return nil
}
