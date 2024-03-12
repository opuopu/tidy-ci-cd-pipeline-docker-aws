const insertAdditionalTaskIntoDb = async (payload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Add.create(payload);
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to assign task");
    }
    emitMessage(payload?.employee, TaskNotifcationMessage.grocery);
    await notificationServices.insertNotificationIntoDB(
      [
        {
          receiver: payload.employee,
          refference: result?._id,
          message: TaskNotifcationMessage.grocery,
          type: "task",
        },
      ],
      session
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
