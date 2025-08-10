import { showToast } from "@/components/common/toast";
import axios from "axios";

export const getCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAWa4W4w1VpkyMYaBGU6jeDBshFOuas3rI`,
    );
    const { results } = response.data;
    if (results.length > 0) {
      const location = results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      showToast({
        title: "Không thể tìm thấy vị trí",
        bgColor: "error",
        focus: "medium",
        size: "medium",
      });

      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    showToast({
      title: "Đã xảy ra lỗi khi tìm kiếm vị trí",
      bgColor: "error",
      focus: "medium",
      size: "medium",
    });

    return null;
  }
};
