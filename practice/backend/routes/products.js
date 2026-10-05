const express=require("express");
const fs=require("fs");
const path=require("path");

const router=express.Router();

const dataPath=path.join(__dirname,"..","data","data.json");

router.get("/",(req,res)=>{
  fs.readFile(dataPath,"utf8",(error,data)=>{
    if(error){
      res.status(500);
      res.send("error in opening file");
      return;
    }

    const product=JSON.parse(data);

    res.json(product);
  });
});

router.get("/:id",(req,res)=>{

  const id = Number(req.params.id);

  fs.readFile(dataPath,"utf8",(error,data)=>{
    if(error){
      res.status(500);
      res.send("error in opening file");
      return;
    }

    const products=JSON.parse(data);

    const product=products.find((item)=>{
      return item.id==id;
    });

     if(!product){
        return res.status(404)
      }
    res.json(product);
  });
});

router.post("/",(req,res)=>{
  fs.readFile(dataPath,"utf8",(error,data)=>{
    if(error){
      res.status(500);
      res.send("error in opening file");
    }

    const products=JSON.parse(data);

    const newProduct={
      id:products.length+1,
      name:req.body.name,
      category: req.body.category,
      price:req.body.price,
      quantity:req.body.quantity
    };

    products.push(newProduct);

    fs.writefile(dataPath,JSON.stringify(products,null,2),(error)=>{
      if(error){
        res.status(500);
        res.send("error in opening file");
      }

      res.status(200);
      res.json({
        message:"Product registered successfully",            product:newProduct
      });
    });
  });
});

router.put("/:id", (req, res) => {

    const id = Number(req.params.id);

    const data = fs.readFileSync(
        dataPath,
        "utf-8"
    );

    const products = JSON.parse(data);

    const index = products.findIndex((item) => {
        return item.id === id;
    });

    if (index === -1) {

        return res.status(404).json({
            message: "Product not found"
        });

    }

    products[index] = {
        id: id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    };

    fs.writeFileSync(
        dataPath,
        JSON.stringify(products, null, 2)
    );

    res.json(products[index]);

});

router.patch("/:id", (req, res) => {

    const id = Number(req.params.id);

    const data = fs.readFileSync(
        dataPath,
        "utf-8"
    );

    const products = JSON.parse(data);

    const index = products.findIndex((item) => {
        return item.id === id;
    });

    if (index === -1) {

        return res.status(404).json({
            message: "Product not found"
        });

    }

    products[index] = {
        ...products[index],
        ...req.body
    };

    fs.writeFileSync(
        dataPath,
        JSON.stringify(products, null, 2)
    );

    res.json(products[index]);

});


router.delete("/:id", (req, res) => {

    const id = Number(req.params.id);

    const data = fs.readFileSync(
        dataPath,
        "utf-8"
    );

    const products = JSON.parse(data);

    const index = products.findIndex((item) => {
        return item.id === id;
    });

    if (index === -1) {

        return res.status(404).json({
            message: "Product not found"
        });

    }

    const deletedProduct = products.splice(index, 1);

    fs.writeFileSync(
        dataPath,
        JSON.stringify(products, null, 2)
    );

    res.json({
        message: "Product deleted",
        product: deletedProduct[0]
    });

});


module.exports=router;