import { Document, Schema, model } from "mongoose";

export interface CardDocument extends Document {
  title: String
  description: String
  owner: String
  list: String
  createAt: Date
  updateAt: Date
}

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Card = model<CardDocument>("Card", cardSchema);