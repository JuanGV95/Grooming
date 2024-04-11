document.addEventListener("DOMContentLoaded", async function () {
  const deleteUserButton = document.getElementById("deleteUserButton");
  const deleteInactiveUsersButton = document.getElementById(
    "deleteInactiveUsersButton"
  );
  const deleteProductButton = document.getElementById("deleteProductButton");
  const changeToPremiumButton = document.getElementById(
    "changeToPremiumButton"
  );

  // Event listener para eliminar usuario por ID
  deleteUserButton.addEventListener("click", async function (event) {
    const userId = document.getElementById("userId").value;
    if (!userId) return;

    try {
      const response = await fetch(`api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      console.log("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      console.warn("Error al eliminar usuario");
    }
  });

  // Event listener para eliminar usuarios inactivos
  deleteInactiveUsersButton.addEventListener("click", async function () {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      console.log("Usuarios inactivos eliminados correctamente");
    } catch (error) {
      console.error("Error al eliminar usuarios inactivos:", error.message);
      console.warn("Error al eliminar usuarios inactivos");
    }
  });

  // Event listener para eliminar producto por ID
  deleteProductButton.addEventListener("click", async function () {
    const productId = document.getElementById("productId").value;
    if (!productId) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
      console.warn("Error al eliminar producto");
    }
  });

  // Event listener para cambiar usuario a premium por ID
  changeToPremiumButton.addEventListener("click", async function () {
    const userId = document.getElementById("premiumUserId").value;
    if (!userId) return;

    try {
      const response = await fetch(`/api/users/premium/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role: "premium" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      console.log("Usuario cambiado a premium correctamente");
    } catch (error) {
      console.error("Error al cambiar usuario a premium:", error.message);
      console.warn("Error al cambiar usuario a premium");
    }
  });
});
