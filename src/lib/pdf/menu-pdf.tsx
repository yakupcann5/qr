import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { ALLERGENS } from "@/lib/constants";

// Register fonts (system-safe)
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: "#1e293b",
  },
  // Header
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 8,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
  },
  businessDesc: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
    maxWidth: "80%",
  },
  // Category
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },
  categoryDesc: {
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 8,
    paddingLeft: 14,
  },
  // Product
  productRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottom: "1px solid #f1f5f9",
  },
  productRowAlt: {
    backgroundColor: "#f8fafc",
  },
  productSoldOut: {
    opacity: 0.4,
  },
  productImage: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 8,
    objectFit: "cover",
  },
  productContent: {
    flex: 1,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: "#3b82f6",
  },
  soldOutText: {
    fontSize: 10,
    fontWeight: 600,
    color: "#ef4444",
  },
  productDesc: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
    lineHeight: 1.4,
  },
  // Meta row
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 3,
  },
  metaText: {
    fontSize: 7,
    color: "#94a3b8",
  },
  badge: {
    fontSize: 7,
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

interface CategoryData {
  id: string;
  name: string;
  description: string | null;
  translations: { languageCode: string; name: string; description: string | null }[];
  products: ProductData[];
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isSoldOut: boolean;
  calories: number | null;
  preparationTime: number | null;
  allergens: string[];
  badges: string[];
  translations: { languageCode: string; name: string; description: string | null }[];
}

interface MenuPdfProps {
  businessName: string;
  businessDescription: string | null;
  logoUrl: string | null;
  categories: CategoryData[];
  lang: string;
  showImages: boolean;
  showDetailFields: boolean;
}

function getTranslation(
  translations: { languageCode: string; name: string; description: string | null }[],
  lang: string,
  fallbackName: string,
  fallbackDesc: string | null
) {
  const t = translations.find((tr) => tr.languageCode === lang);
  return {
    name: t?.name ?? fallbackName,
    description: t?.description ?? fallbackDesc,
  };
}

export function MenuPdfDocument({
  businessName,
  businessDescription,
  logoUrl,
  categories,
  lang,
  showImages,
  showDetailFields,
}: MenuPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <View>
              <Text style={styles.businessName}>{businessName}</Text>
              {businessDescription && (
                <Text style={styles.businessDesc}>{businessDescription}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Categories */}
        {categories.map((category) => {
          const catTr = getTranslation(
            category.translations,
            lang,
            category.name,
            category.description
          );

          return (
            <View key={category.id} style={styles.categorySection} wrap={false}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryDot} />
                <Text style={styles.categoryName}>{catTr.name}</Text>
              </View>
              {catTr.description && (
                <Text style={styles.categoryDesc}>{catTr.description}</Text>
              )}

              {category.products.map((product, i) => {
                const prodTr = getTranslation(
                  product.translations,
                  lang,
                  product.name,
                  product.description
                );

                return (
                  <View
                    key={product.id}
                    style={[
                      styles.productRow,
                      i % 2 === 1 ? styles.productRowAlt : {},
                      product.isSoldOut ? styles.productSoldOut : {},
                    ]}
                    wrap={false}
                  >
                    {showImages && product.imageUrl && (
                      <Image src={product.imageUrl} style={styles.productImage} />
                    )}
                    <View style={styles.productContent}>
                      <View style={styles.productNameRow}>
                        <Text style={styles.productName}>{prodTr.name}</Text>
                        {product.isSoldOut ? (
                          <Text style={styles.soldOutText}>Tükendi</Text>
                        ) : (
                          <Text style={styles.productPrice}>
                            ₺{String(product.price)}
                          </Text>
                        )}
                      </View>
                      {prodTr.description && (
                        <Text style={styles.productDesc}>{prodTr.description}</Text>
                      )}

                      {/* Meta */}
                      {(product.badges.length > 0 ||
                        (showDetailFields &&
                          (product.calories || product.preparationTime || product.allergens.length > 0))) && (
                        <View style={styles.metaRow}>
                          {product.badges.map((badge) => (
                            <Text key={badge} style={styles.badge}>
                              {badge}
                            </Text>
                          ))}
                          {showDetailFields && product.calories && (
                            <Text style={styles.metaText}>
                              {product.calories} kcal
                            </Text>
                          )}
                          {showDetailFields && product.preparationTime && (
                            <Text style={styles.metaText}>
                              {product.preparationTime} dk
                            </Text>
                          )}
                          {showDetailFields && product.allergens.length > 0 && (
                            <Text style={styles.metaText}>
                              {product.allergens
                                .map(
                                  (id) =>
                                    ALLERGENS.find((a) => a.id === id)?.label ?? id
                                )
                                .join(", ")}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{businessName}</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
