-- Banco de dados para a Vander Store
-- Criação das tabelas principais


-- Tabela de categorias
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NULL,
    image_url VARCHAR(500) NOT NULL,
    category_id INT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabela de carrinho (sessão)
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_product (session_id, product_id)
);

-- Inserir categorias
INSERT INTO categories (name, slug, description) VALUES
('Figuras de Ação', 'figuras', 'Figuras colecionáveis dos seus animes favoritos'),
('Roupas & Acessórios', 'roupas', 'Camisetas, hoodies e acessórios temáticos'),
('Mangás & Livros', 'mangas', 'Mangás, light novels e artbooks'),
('Eletrônicos', 'eletronicos', 'Gadgets e eletrônicos com tema anime'),
('Casa & Decoração', 'casa', 'Itens decorativos para sua casa'),
('Promoções', 'promocoes', 'Produtos em oferta especial');

-- Inserir produtos
INSERT INTO products (name, slug, description, price, original_price, image_url, category_id, is_featured, is_on_sale, stock_quantity) VALUES
-- Figuras de Ação
('Figura Naruto Uzumaki Premium', 'figura-naruto-uzumaki-premium', 'Figura premium do Naruto Uzumaki com detalhes incríveis e alta qualidade de acabamento.', 89.99, 119.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 1, TRUE, TRUE, 15),
('Figura Goku Super Saiyan', 'figura-goku-super-saiyan', 'Figura do Goku em sua forma Super Saiyan com efeitos especiais de energia.', 94.99, NULL, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 1, TRUE, FALSE, 20),
('Figura Luffy Gear 4', 'figura-luffy-gear-4', 'Figura do Monkey D. Luffy em sua transformação Gear 4 Boundman.', 79.99, 99.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 1, FALSE, TRUE, 12),
('Figura Ichigo Bankai', 'figura-ichigo-bankai', 'Figura do Ichigo Kurosaki em sua forma Bankai com espada Zangetsu.', 84.99, NULL, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 1, FALSE, FALSE, 18),

-- Roupas & Acessórios
('Camiseta Attack on Titan', 'camiseta-attack-on-titan', 'Camiseta oficial do Attack on Titan com design exclusivo e tecido de alta qualidade.', 29.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2, TRUE, FALSE, 50),
('Hoodie One Piece', 'hoodie-one-piece', 'Moletom com capuz do One Piece, perfeito para os fãs da série.', 49.99, 69.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2, FALSE, TRUE, 30),
('Boné Dragon Ball Z', 'bone-dragon-ball-z', 'Boné ajustável com logo do Dragon Ball Z bordado.', 24.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2, FALSE, FALSE, 40),
('Mochila Naruto', 'mochila-naruto', 'Mochila escolar com design do Naruto, ideal para estudantes.', 39.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2, FALSE, FALSE, 25),

-- Mangás & Livros
('Mangá Demon Slayer Vol. 1-10', 'manga-demon-slayer-vol-1-10', 'Coleção completa dos primeiros 10 volumes do mangá Demon Slayer.', 149.99, 199.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 3, TRUE, TRUE, 8),
('Light Novel Sword Art Online', 'light-novel-sword-art-online', 'Light novel oficial de Sword Art Online traduzida para o português.', 34.99, NULL, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 3, FALSE, FALSE, 22),
('Artbook Studio Ghibli', 'artbook-studio-ghibli', 'Livro de arte oficial do Studio Ghibli com ilustrações exclusivas.', 89.99, NULL, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 3, FALSE, FALSE, 10),
('Mangá One Piece Vol. 100', 'manga-one-piece-vol-100', 'Volume especial 100 do mangá One Piece com capa exclusiva.', 24.99, NULL, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 3, FALSE, FALSE, 35),

-- Eletrônicos
('Fone de Ouvido Anime Edition', 'fone-ouvido-anime-edition', 'Fone de ouvido com design temático de anime e qualidade de som superior.', 79.99, NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 4, TRUE, FALSE, 15),
('Mouse Pad Gamer Anime', 'mouse-pad-gamer-anime', 'Mouse pad grande com estampa de anime e base antiderrapante.', 39.99, 54.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 4, FALSE, TRUE, 45),
('Teclado RGB Otaku', 'teclado-rgb-otaku', 'Teclado mecânico com iluminação RGB e teclas personalizadas.', 159.99, NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 4, FALSE, FALSE, 12),
('Carregador Portátil Pikachu', 'carregador-portatil-pikachu', 'Power bank com design do Pikachu, capacidade de 10000mAh.', 49.99, NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 4, FALSE, FALSE, 28),

-- Casa & Decoração
('Caneca Totoro Térmica', 'caneca-totoro-termica', 'Caneca térmica com design do Totoro que mantém a bebida quente.', 19.99, NULL, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 5, TRUE, FALSE, 60),
('Almofada Kawaii', 'almofada-kawaii', 'Almofada decorativa com estampa kawaii super fofa.', 24.99, NULL, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 5, FALSE, FALSE, 35),
('Poster Attack on Titan', 'poster-attack-on-titan', 'Poster oficial do Attack on Titan em alta qualidade.', 14.99, NULL, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 5, FALSE, FALSE, 80),
('Luminária LED Anime', 'luminaria-led-anime', 'Luminária LED com formas de personagens de anime.', 34.99, NULL, 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 5, FALSE, FALSE, 20),

-- Produtos adicionais para completar o catálogo
('Figura Sailor Moon', 'figura-sailor-moon', 'Figura da Sailor Moon com acessórios e base especial.', 74.99, NULL, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', 1, FALSE, FALSE, 16),
('Camiseta My Hero Academia', 'camiseta-my-hero-academia', 'Camiseta do My Hero Academia com estampa do All Might.', 27.99, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2, FALSE, FALSE, 42),
('Mangá Tokyo Ghoul', 'manga-tokyo-ghoul', 'Mangá completo de Tokyo Ghoul em edição especial.', 44.99, NULL, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 3, FALSE, FALSE, 18),
('Mousepad Evangelion', 'mousepad-evangelion', 'Mouse pad temático de Neon Genesis Evangelion.', 29.99, NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 4, FALSE, FALSE, 33);

