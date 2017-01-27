import tornado.web
import tornado.ioloop

class IndexRoute(tornado.web.RequestHandler):
    def get(self):
        self.write('This is a test.')

def make_app():
    return tornado.web.Application([
        (r"/", IndexRoute),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(3000)
    tornado.ioloop.IOLoop.current().start()
