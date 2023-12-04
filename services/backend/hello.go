package main
import (
    "fmt"
	"os"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
	"net/http"
  
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   int    `json:"id"`
	CognitoId string `json:"cognito_id"`
	Username string `json:"username"`
	// Add more fields as needed
}

func main() {
	fmt.Println("Go MySQL Tutorial")
	fmt.Println(os.Getenv("DATABASE_URL"))
    db, err := sql.Open("mysql", os.Getenv("DATABASE_URL"))
    if err != nil {
        panic(err.Error())
    }
	
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		//Get Users from database
		rows, err := db.Query("SELECT * FROM Users")
		if err != nil {
			panic(err.Error())
		}
		defer rows.Close()

		// Iterate through the result set
		var users []User
		for rows.Next() {
			var user User
			// var id int
			// var name string
			err = rows.Scan(&user.ID, &user.CognitoId, &user.Username)
			if err != nil {
				panic(err.Error())
			}
			users = append(users, user)
		}


		c.JSON(http.StatusOK, gin.H{
		"message": "pong",
		"users": users,
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")

    defer db.Close()
    fmt.Println("Success!")
}