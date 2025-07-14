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

botao_projetos = navegador.find_elements("class name", "nav-link")

for botao in botao_projetos:
    if "Projetos" in botao.text:
        botao.click()
        break
time.sleep(2)

botao_venda = navegador.find_elements("class name", "project-link")

for botao in botao_venda:
    href = botao.get_attribute("href")
    if "https://vendas01.infinityfreeapp.com/?i=1" in href:
        botao.click()
        break


time.sleep(10)