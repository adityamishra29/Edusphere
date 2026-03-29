import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QToolBar, QAction, QLineEdit, QVBoxLayout, QWidget, QLabel
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QPixmap, QIcon

class Browser(QMainWindow):
    def __init__(self):
        super().__init__()
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("https://unrivaled-buttercream-25b45b.netlify.app/"))

        self.setWindowTitle("EduReach - Education Everywhere")
        self.setWindowIcon(QIcon("favicon.ico")) 
        self.setCentralWidget(self.browser)

        # Create a toolbar
        toolbar = QToolBar()
        self.addToolBar(toolbar)

        # Add logo to the toolbar
        logo = QLabel()
        pixmap = QPixmap("path/to/your/logo.png")
        logo.setPixmap(pixmap)
        toolbar.addWidget(logo)

        # Create navigation buttons
        back_btn = QAction('Back', self)
        back_btn.triggered.connect(self.browser.back)
        toolbar.addAction(back_btn)

        forward_btn = QAction('Forward', self)
        forward_btn.triggered.connect(self.browser.forward)
        toolbar.addAction(forward_btn)

        reload_btn = QAction('Reload', self)
        reload_btn.triggered.connect(self.browser.reload)
        toolbar.addAction(reload_btn)

        home_btn = QAction('Home', self)
        home_btn.triggered.connect(self.navigate_home)
        toolbar.addAction(home_btn)

        # Create a URL bar
        self.url_bar = QLineEdit()
        self.url_bar.returnPressed.connect(self.navigate_to_url)
        toolbar.addWidget(self.url_bar)

        # Update URL bar when the URL changes
        self.browser.urlChanged.connect(self.update_url_bar)

        self.showMaximized()

    def navigate_home(self):
        self.browser.setUrl(QUrl("https://unrivaled-buttercream-25b45b.netlify.app/"))

    def navigate_to_url(self):
        url = self.url_bar.text()
        self.browser.setUrl(QUrl(url))

    def update_url_bar(self, q):
        self.url_bar.setText(q.toString())

if __name__ == "__main__":
    app = QApplication(sys.argv)
    browser = Browser()
    sys.exit(app.exec_())