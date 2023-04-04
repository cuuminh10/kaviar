import { Collection } from "../../..";
import { ObjectId } from "mongodb";
import { User, Users } from "./users";
import { Post, Posts } from "./posts";
import { Behaviors } from "../../../behaviors";

export class Comment {
  _id?: ObjectId;
  title: string;
  date: Date;

  // virtual
  titleAndDate: string;

  // virtual
  get titleWithUserId() {
    return this.title + " " + this.userId;
  }

  userId: ObjectId;
  user: User;

  postId: ObjectId;
  post: Post;
}

export class Comments extends Collection<Comment> {
  static model = Comment;
  static collectionName = "comments";

  static links = {
    post: {
      collection: () => Posts,
      field: "postId",
    },
    user: {
      collection: () => Users,
      field: "userId",
    },
  };

  static reducers = {
    titleAndDate: {
      dependency: {
        title: 1,
        date: 1,
      },
      reduce({ title, date }) {
        return `${title} - ${date.getTime()}`;
      },
    },
  };

  static expanders = {
    titleWithUserId: {
      title: 1,
      userId: 1,
    },
  };

  static behaviors = [
    Behaviors.Softdeletable({
      fields: {
        isDeleted: "customIsDeletedField",
      },
    }),
  ];
}
