import { type Document, Schema, model } from "mongoose";

export interface ListDocument extends Document {
  name: string;
  cards: string[];
  board: string
  owner: string;
}

const ListSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "请输入名字"],
    },
    cards: [{
      type: Schema.Types.ObjectId,
      ref: "Card",
    }],
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true
  }
);

export const List = model<ListDocument>("List", ListSchema);
