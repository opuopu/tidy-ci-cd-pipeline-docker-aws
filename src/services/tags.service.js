import Tags from "../models/tags.model.js";
const insertTagIntoDB = async (payload) => {
  const result = await Tags.create(payload);
  return result;
};
const getAllTagsByQuery = async (userId, payload) => {
  const query = {};
  query["user"] = userId;
  if (payload.searchTerm) {
    query.title = { $regex: payload.searchTerm, $options: "i" };
  }
  const result = await Tags.find(query).populate("user");
  return result;
};
const getsingleTag = async (id, userId) => {
  const result = await Tags.findOne({
    $and: [
      {
        _Id: id,
      },
      {
        user: userId,
      },
    ],
    s,
  }).populate("user");
  return result;
};
const updateTags = async (id, userId, payload) => {
  const result = await Tags.findOneAndUpdate(
    {
      $and: [
        {
          _id: id,
        },
        {
          user: userId,
        },
      ],
    },
    payload,
    { new: true }
  );
  return result;
};
const deleteTag = async (id, userId) => {
  const result = await Tags.findByIdAndDelete({
    $and: [
      {
        _Id: id,
      },
      {
        user: userId,
      },
    ],
  });
  return result;
};

const tagservices = {
  insertTagIntoDB,
  getAllTagsByQuery,
  getsingleTag,
  updateTags,
  deleteTag,
};

export default tagservices;
