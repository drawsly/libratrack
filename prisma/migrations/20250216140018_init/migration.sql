-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "book_name" VARCHAR(100),
    "author_name" VARCHAR(50),
    "publisher" VARCHAR(100),
    "publish_year" INTEGER,
    "page_count" INTEGER,
    "book_type" VARCHAR(100),
    "book_case" VARCHAR(50),
    "shelf" INTEGER,
    "row" INTEGER,
    "entrusted" BOOLEAN DEFAULT false,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "reader_id" TEXT NOT NULL,
    "loan_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "return_date" DATE NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "readers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50),
    "surname" VARCHAR(50),
    "gender" CHAR,
    "school_no" INTEGER,
    "phone" VARCHAR(20),
    "adress" TEXT,

    CONSTRAINT "readers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50),
    "surname" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "fk_loans_books_id" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "fk_loans_users_id" FOREIGN KEY ("reader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
