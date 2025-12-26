import Product from "../models/ProductModel.js";
import Settings from "../models/SettingModel.js";


export const getDashboardStats = async (req, res) => {
  try {
    const { organizationId } = req.user;

    // Fetch org settings (for default low stock threshold)
    const settings = await Settings.findOne({ organization: organizationId })
      .lean();

    const defaultThreshold =
      settings?.defaultLowStockThreshold ?? 5;

    // Fetch all products for org
    const products = await Product.find({ organization: organizationId })
      .select("name sku quantity lowStockThreshold")
      .lean();

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, p) => sum + (p.quantity || 0),
      0
    );

    // Low stock logic
    const lowStockItems = products.filter((p) => {
      const threshold =
        p.lowStockThreshold ?? defaultThreshold;
      return p.quantity <= threshold;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalQuantity,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.map((p) => ({
          id: p._id,
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          lowStockThreshold:
            p.lowStockThreshold ?? defaultThreshold,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
