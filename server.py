import tornado.web
import tornado.ioloop

class IndexRoute(tornado.web.RequestHandler):
    def get(self):
        self.write('This is a test.')

class CreateUser(tornado.web.RequestHandler):
    def post(self):
        username = self.get_body_argument('username')
        password = self.get_body_argument('password')
        email = self.get_body_argument('email')

class UserProfile(tornado.web.RequestHandler):
    def get(self, id):
        print(id)

def make_app():
    return tornado.web.Application([
        (r"/", IndexRoute),
        (r"/user/create", CreateUser),
        (r"/user/([0-9]+)/profile", UserProfile)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(3000)
    tornado.ioloop.IOLoop.current().start()
