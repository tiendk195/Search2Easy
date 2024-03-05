document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const locationInput = document.getElementById("location");
  const limitInput = document.getElementById("limit");
  const languageInput = document.getElementById("language");
  const regionInput = document.getElementById("region");
  const resultsDiv = document.getElementById("results");

  searchBtn.addEventListener("click", async () => {
    const location = locationInput.value.trim();
    if (location === "") {
      alert("Vui lòng nhập địa điểm!");
      return;
    }

    const formattedLocation = encodeURIComponent(location);
    const limit = limitInput.value.trim() || 20;
    const language = languageInput.value.trim() || "en";
    const region = regionInput.value.trim() || "us";

    const url = `https://local-business-data.p.rapidapi.com/search?query=${formattedLocation}&limit=${limit}&lat=37.359428&lng=-121.925337&zoom=13&language=${language}&region=${region}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "94c20f9b9cmsh1ba619fda7b3d93p1953d5jsn33de2389b05a",
        "X-RapidAPI-Host": "local-business-data.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error(error);
      resultsDiv.innerHTML =
        "<p>Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.</p>";
    }
  });

  function formatWorkingHours(workingHours) {
    let hoursList = [];
    for (let day in workingHours) {
      hoursList.push(`${day}: ${workingHours[day].join(", ")}`);
    }
    return hoursList.join("<br>");
  }

  function displayResults(data) {
    resultsDiv.innerHTML = ""; // Clear previous results

    if (data && data.data && data.data.length > 0) {
      const businesses = data.data;
      const ul = document.createElement("ul");
      businesses.forEach((business) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <p><strong>${business.name}</strong></p>
                    <p>Địa chỉ: ${business.address}, ${business.city}</p>
                    <p>Giờ làm việc: ${formatWorkingHours(
                      business.working_hours
                    )}</p>
                    <p>Website: ${business.website}</p>
                    <p>Link địa điểm: <a href="${
                      business.place_link
                    }" target="_blank">${business.place_link}</a></p>
                    <p>Trạng thái: ${business.business_status}</p>
                    <p>Số lượt đánh giá: ${business.review_count}</p>
                    <p>Đánh giá: ${business.rating}</p>
                    ${
                      business.photos_sample &&
                      business.photos_sample.length > 0
                        ? `<p>Hình ảnh mẫu: <img src="${business.photos_sample[0].photo_url}" alt="Hình ảnh mẫu"></p>`
                        : `<p>Không có hình ảnh mẫu.</p>`
                    }
                `;
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    } else {
      resultsDiv.innerHTML =
        "<p>Không tìm thấy kết quả nào cho địa điểm này.</p>";
    }
  }
});
