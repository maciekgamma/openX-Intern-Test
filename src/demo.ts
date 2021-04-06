import {
  descriptiveCountPostByUsers,
  findNearestUsers,
  findTitleDuplicates,
  getPosts,
  getUsers,
} from ".";

const present = async () => {
  const posts = await getPosts();
  const users = await getUsers();
  console.log(
    `Znaleziono ${posts.length} postów i ${users.length} użytkowników`
  );
  for (const line of descriptiveCountPostByUsers(posts, users)) {
    console.log(line);
  }
  const duplicates = findTitleDuplicates(posts);
  console.log(
    `W tym ${duplicates.length} tytułów które się powtarzają: ${duplicates}`
  );
  const nearest = findNearestUsers(users);
  for (const [user, neighbour] of nearest) {
    console.log(`Najbliżej użytkownika ${user.name} mieszka ${neighbour.name}`);
  }
};

present();
