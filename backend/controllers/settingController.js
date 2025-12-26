import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  try {
    const { organizationId } = req.user;

    let settings = await Settings.findOne({
      organization: organizationId,
    });

    // If settings not found (edge case), create default
    if (!settings) {
      settings = await Settings.create({
        organization: organizationId,
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

 
export const updateSettings = async (req, res) => {
  try {
    const { organizationId } = req.user;
    const { defaultLowStockThreshold } = req.body;

    if (defaultLowStockThreshold === undefined) {
      return res.status(400).json({
        success: false,
        message: "defaultLowStockThreshold is required",
      });
    }

    if (defaultLowStockThreshold < 0) {
      return res.status(400).json({
        success: false,
        message: "Threshold must be a non-negative number",
      });
    }

    const settings = await Settings.findOneAndUpdate(
      { organization: organizationId },
      { defaultLowStockThreshold },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
