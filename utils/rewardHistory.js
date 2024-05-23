import rewardHistory from "../models/historyReward/rewardHistoryModel.js";

 const updateOrCreateRecord = async(date, userId, reward) =>{
    try {
      let existingDate = await rewardHistory.findOne({ date });
        
      if (!existingDate) {
        existingDate = new rewardHistory({ date, rewards: [] });
      }
      const existingReward = existingDate.rewards.find((r) => r.id === userId);
  
      if (existingReward) {
        existingReward.reward += reward;
      } else {
        existingDate.rewards.push({ id: userId, reward });
      }
     let data =  await existingDate.save();
      return data

    } catch (error) {
      console.error('Error updating or creating record:', error);
    }
  }
  
  // Usage example
  
  export default updateOrCreateRecord; 