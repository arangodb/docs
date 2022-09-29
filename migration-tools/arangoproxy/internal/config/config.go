package config

type Config struct {
	Repositories []Repository
	Cache        string
	Log          string
}

type Repository struct {
	Url            string
	Authentication []Authentication
}

type Authentication interface {
	Authenticate()
}

type UserPassAuthentication struct {
	User string
	Pass string
}

func (auth UserPassAuthentication) Authenticate() {

}
