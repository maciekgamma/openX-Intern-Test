import { getPosts, getUsers, User } from "../src/fetcher";
import axios from "axios";
import { posts as mockPosts } from "./mockData/posts";
import { users as mockUsers } from "./mockData/users";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("mock API tests", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("requests and parses list of posts", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPosts });
    return getPosts().then((posts) => {
      expect(posts).toEqual(mockPosts);
    });
  });

  it("requests and parses list of users", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockUsers });
    return getUsers().then((users) => {
      expect(users).toEqual(mockUsers);
    });
  });

  it("requests and parses list of users", async () => {
    mockedAxios.get.mockRejectedValue("Error");
    return getUsers().catch((err) => {
      expect(err).toEqual("Error");
    });
  });

  it("handles data in wrong format", async () => {
    mockedAxios.get.mockResolvedValue({ data: [{}] });
    return getUsers().then((result) => {
      expect(result).toEqual([]);
    });
  });
});
