import axiosClient from "@/utils/axios"

export const checkLoginStatus = async () => {
  let result = false
  const response = await axiosClient
    .get("/auth/")
    .then(() => {
      result = true
    })
    .catch(() => {
      result = false
    })
  return result
}

export const login = async (username: string, password: string) => {
  let result = false
  const response = await axiosClient
    .post("/auth/login", {
      username,
      password,
    })
    .then((res) => {
      if (res.status === 200) {
        result = true
      } else {
        result = false
      }
    })
    .catch(() => {
      result = false
    })
  return result
}
