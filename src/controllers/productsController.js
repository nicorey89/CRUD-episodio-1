const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = (products) => {
	fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8')
};

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
		productos: products,
		toThousand
	})
    },

	// Detail - Detail from one product
	detail: (req, res) => {
		let productoID = req.params.id
		let producto = products.find(product => product.id == productoID)
		res.render('detail', {
			producto,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastID = products[products.length -1].id;
		let newProduct = {
			"id": lastID + 1,
			"name": req.body.name,
			"price": req.body.price,
			"discount": req.body.discount,
			"category": req.body.category,
			"description": req.body.description,
			"image": "default-image.png",
		};
		products.push(newProduct);
		

		res.redirect("/products/")
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productID = Number(req.params.id);
		let productToEdit = products.find(product => product.id === productID);
		res.render("product-edit-form", {
			productToEdit
		})

	},
	// Update - Method to update
	update: (req, res) => {
		let productID = Number(req.params.id);
		products.forEach(product => {
			if(product.id == productID){
				product.name = req.body.name,
				product.price = req.body.price,
				product.discount = req.body.discount,
				product.category = req.body.category,
				product.description = req.body.description
			}
		});
		writeJson(products);
		/* res.send("Producto Editado Correctamente"); */
		res.redirect("/products/")
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productID = Number(req.params.id);
		products.forEach(product => {
			if(product.id == productID){
				let productDestroy = products.indexOf(product);
				products.splice(productDestroy, 1)
			};
		});

		writeJson(products);
		res.redirect("/products/")
	}
};

module.exports = controller;