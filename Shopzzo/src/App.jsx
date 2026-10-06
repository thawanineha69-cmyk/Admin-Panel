import { Navigate, Route, Routes } from "react-router-dom";

// Common
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import {
  AdminLayout,
  ProtectedRoute,
} from "./components/CommonRoute/Common";

// Category
import AddCategory from "./components/Category/AddCategory";
import ViewCategory from "./components/Category/ViewCategory";

// Sub Category
import AddSubCategory from "./components/SubCategory/AddSubCategory";
import ViewSubCategory from "./components/SubCategory/ViewSubCategory";

// Sub Sub Category
import AddSubSubCategory from "./components/SubSubCategory/AddSubSubCategory";
import ViewSubSubCategory from "./components/SubSubCategory/ViewSubSubCategory";

// Material
import AddMaterial from "./components/Material/AddMaterial";
import ViewMaterial from "./components/Material/ViewMaterial";
import UpdateMaterial from "./components/Material/UpdateMaterial";

// Product
import AddProduct from "./components/Product/AddProduct";
import ViewProduct from "./components/Product/ViewProduct";

// Color
import AddColor from "./components/Color/AddColor";
import ViewColor from "./components/Color/ViewColor";

// Brand
import AddBrand from "./components/Brand/AddBrand";
import ViewBrand from "./components/Brand/ViewBrand";

// Testimonial
import AddTestimonial from "./components/Testimonial/AddTestimonial";
import ViewTestimonial from "./components/Testimonial/ViewTestimonial";

// Accordion
import AddAccordian from "./components/Accordian/AddAccordian";
import ViewAccordian from "./components/Accordian/ViewAccordian";

// Why Choose Us
import AddWhyChooseUs from "./components/WhyChooseUs/AddWhyChooseUs";
import ViewWhyChooseUs from "./components/WhyChooseUs/ViewWhyChooseUs";

// Protected Page Wrapper
const ProtectedPage = ({ children }) => {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <Routes>

      {/* ==================== AUTH ==================== */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* ==================== DASHBOARD ==================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedPage>
            <Dashboard />
          </ProtectedPage>
        }
      />

      {/* ==================== CATEGORY ==================== */}
      <Route
        path="/category/add"
        element={
          <ProtectedPage>
            <AddCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/category/view"
        element={
          <ProtectedPage>
            <ViewCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/category/update/:id"
        element={
          <ProtectedPage>
            <AddCategory />
          </ProtectedPage>
        }
      />

      {/* ==================== SUB CATEGORY ==================== */}
      <Route
        path="/subcategory/add"
        element={
          <ProtectedPage>
            <AddSubCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/subcategory/view"
        element={
          <ProtectedPage>
            <ViewSubCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/subcategory/update/:id"
        element={
          <ProtectedPage>
            <AddSubCategory />
          </ProtectedPage>
        }
      />

      {/* ==================== SUB SUB CATEGORY ==================== */}
      <Route
        path="/subsubcategory/add"
        element={
          <ProtectedPage>
            <AddSubSubCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/subsubcategory/view"
        element={
          <ProtectedPage>
            <ViewSubSubCategory />
          </ProtectedPage>
        }
      />

      <Route
        path="/subsubcategory/update/:id"
        element={
          <ProtectedPage>
            <AddSubSubCategory />
          </ProtectedPage>
        }
      />

      {/* ==================== MATERIAL ==================== */}
      <Route
        path="/material/add"
        element={
          <ProtectedPage>
            <AddMaterial />
          </ProtectedPage>
        }
      />

      <Route
        path="/material/view"
        element={
          <ProtectedPage>
            <ViewMaterial />
          </ProtectedPage>
        }
      />

      <Route
        path="/material/update/:id"
        element={
          <ProtectedPage>
            <UpdateMaterial />
          </ProtectedPage>
        }
      />

      {/* ==================== PRODUCT ==================== */}
      <Route
        path="/product/add"
        element={
          <ProtectedPage>
            <AddProduct />
          </ProtectedPage>
        }
      />

      <Route
        path="/product/view"
        element={
          <ProtectedPage>
            <ViewProduct />
          </ProtectedPage>
        }
      />

      <Route
        path="/product/update/:id"
        element={
          <ProtectedPage>
            <AddProduct />
          </ProtectedPage>
        }
      />

      {/* ==================== COLOR ==================== */}
      <Route
        path="/color/add"
        element={
          <ProtectedPage>
            <AddColor />
          </ProtectedPage>
        }
      />

      <Route
        path="/color/view"
        element={
          <ProtectedPage>
            <ViewColor />
          </ProtectedPage>
        }
      />

      <Route
        path="/color/update/:id"
        element={
          <ProtectedPage>
            <AddColor />
          </ProtectedPage>
        }
      />

      {/* ==================== BRAND ==================== */}
      <Route
        path="/brand/add"
        element={
          <ProtectedPage>
            <AddBrand />
          </ProtectedPage>
        }
      />

      <Route
        path="/brand/view"
        element={
          <ProtectedPage>
            <ViewBrand />
          </ProtectedPage>
        }
      />

      <Route
        path="/brand/update/:id"
        element={
          <ProtectedPage>
            <AddBrand />
          </ProtectedPage>
        }
      />

      {/* ==================== TESTIMONIAL ==================== */}
      <Route
        path="/testimonial/add"
        element={
          <ProtectedPage>
            <AddTestimonial />
          </ProtectedPage>
        }
      />

      <Route
        path="/testimonial/view"
        element={
          <ProtectedPage>
            <ViewTestimonial />
          </ProtectedPage>
        }
      />

      <Route
        path="/testimonial/update/:id"
        element={
          <ProtectedPage>
            <AddTestimonial />
          </ProtectedPage>
        }
      />

      {/* ==================== ACCORDION ==================== */}
      <Route
        path="/accordion/add"
        element={
          <ProtectedPage>
            <AddAccordian />
          </ProtectedPage>
        }
      />

      <Route
        path="/accordion/view"
        element={
          <ProtectedPage>
            <ViewAccordian />
          </ProtectedPage>
        }
      />

      <Route
        path="/accordion/update/:id"
        element={
          <ProtectedPage>
            <AddAccordian />
          </ProtectedPage>
        }
      />

      {/* ==================== WHY CHOOSE US ==================== */}
      <Route
        path="/why-choose-us/add"
        element={
          <ProtectedPage>
            <AddWhyChooseUs />
          </ProtectedPage>
        }
      />

      <Route
        path="/why-choose-us/view"
        element={
          <ProtectedPage>
            <ViewWhyChooseUs />
          </ProtectedPage>
        }
      />

      <Route
        path="/why-choose-us/update/:id"
        element={
          <ProtectedPage>
            <AddWhyChooseUs />
          </ProtectedPage>
        }
      />

      {/* ==================== 404 ==================== */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
};

export default App;