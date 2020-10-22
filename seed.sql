CREATE TABLE public.users (
	id uuid NOT NULL,
	email varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"updatedAt" date NOT NULL,
	"createdAt" date NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE TABLE public.notes (
	id uuid NOT NULL,
	"userId" uuid NOT NULL,
	title varchar(255) NOT NULL,
	body varchar(255) NOT NULL,
	"updatedAt" date NOT NULL,
	"createdAt" date NOT NULL,
	CONSTRAINT notes_pk PRIMARY KEY (id)
);

ALTER TABLE public.notes ADD CONSTRAINT notes_fk FOREIGN KEY ("userId") REFERENCES users(id);
