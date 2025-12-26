import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { organizationId, userId } = req.user;

    const {
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = req.body;

    // Basic validation
    if (!name || !sku || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, SKU, and quantity are required",
      });
    }

    const product = await Product.create({
      organization: organizationId,
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      lastUpdatedBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists for this organization",
      });
    }

    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const products = await Product.find({ organization: organizationId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { organizationId, userId } = req.user;
    const { id } = req.params;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, organization: organizationId },
      { ...req.body, lastUpdatedBy: userId },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { id } = req.params;

    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      organization: organizationId,
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
