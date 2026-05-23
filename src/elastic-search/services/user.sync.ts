import { esClient } from "../../config/elastic.search";
import { UserAuthRepository } from "../../repositories/postgres/user/user.auth.repository";
import { UserProfileRepository } from "../../repositories/postgres/user/user.profile.repository";
import { UserProfileService } from "../../services/user/user.profile.service";
import { transformUserSearchDocument } from "../transform/user.search.transform";


const userRepo = new UserAuthRepository()
const userProfileRepo = new UserProfileRepository()
const _userService = new UserProfileService(userRepo , userProfileRepo)

export const syncUserToElasticsearch = async (userId: string) => {

  const fullData = await _userService.fetchUserProfile(userId);

  if (!fullData) {
    return;
  }

  const document = transformUserSearchDocument(fullData.user , fullData.profile , fullData.profileLinks);

  console.log("doc" , document)

  await esClient.update({
    index: "users",
    id: userId,
    doc: document,
    doc_as_upsert: true,
  });

  console.log("User synced:", userId);
};