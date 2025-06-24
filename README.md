# HumanBenchmark
<p>https://docs.google.com/document/d/1U7Vq3FvXQGdLTso4mTCPqquo1bfTKFA1aci5kUJsEM8/edit?usp=sharing</p>




model User {
  id        Int @id @default(autoincrement())
  username  String @unique
  password  String
  pfp       String?
  height    Int?
  weight    Int?
  age       Int?
  gender    String?
  stats     Stat[]
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}

model Workout {
  id           Int @id @default(autoincrement())
  name         String
  type         String
  muscle       String
  equipment    String
  difficulty   String
  instructions String
  stats        Stat[] // Add this line to create a relation back to Stat
}

model Stat {
  id            Int @id @default(autoincrement())
  userId        Int
  user          User @relation(fields: [userId], references: [id]) // Add this line to create a relation back to User
  movementId    Int
  movement      Workout @relation(fields: [movementId], references: [id])
  max           Int
  lastCompleted DateTime[]
  previousMax   Int[]
  updatedAt     DateTime @default(now())
}
