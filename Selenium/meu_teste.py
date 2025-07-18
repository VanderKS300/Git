import time
from selenium import webdriver

# abrir o navegador
navegador = webdriver.Chrome()

# tela cheia
navegador.maximize_window()

# acessar um site
navegador.get("https://testemeu.kesug.com/?i=1")

# selecionar um elemento na tela
theme = navegador.find_element("class name", "theme-toggle")

# clicar no elemento
theme.click()

# encontrar varios elementos
botao_contato = navegador.find_elements("class name", "nav-link")

for botao in botao_contato:
    if "Contato" in botao.text:
        botao.click()
        break
time.sleep(2)

# escrever em um formulario
navegador.find_element("id", "name").send_keys("Vander Baptista de Lima")
navegador.find_element("id", "email").send_keys("vandervnd@hotmail.com")
navegador.find_element("id", "subject").send_keys("Teste")
navegador.find_element("id", "message").send_keys("para mim")

navegador.find_element("class", "btn btn-primary").click

time.sleep(10)