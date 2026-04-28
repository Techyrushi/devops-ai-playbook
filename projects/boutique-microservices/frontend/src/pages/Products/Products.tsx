import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel, { FilterOptions } from '../../components/common/FilterPanel';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { addItem } = useCart();
  const wishlistStorageKey = 'boutique_wishlist';

  const categories = [
    'clothing',
    'accessories',
    'shoes',
    'bags',
    'jewelry',
  ];

  const brands = [
    'Gucci',
    'Prada',
    'Louis Vuitton',
    'Chanel',
    'Hermès',
    'Dior',
    'Versace',
    'Burberry',
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL',
    '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
    'One Size',
  ];

  const colors = [
    'Black', 'White', 'Beige', 'Brown', 'Gray', 'Navy',
    'Red', 'Blue', 'Green', 'Pink', 'Gold', 'Silver',
  ];

  useEffect(() => {
    const loadProducts = async () => {
      console.log('[Products] Starting to load products...');
      try {
        const allProducts = await productService.getAll();
        console.log('[Products] Products loaded:', allProducts.length, allProducts);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('[Products] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const persistedWishlist = localStorage.getItem(wishlistStorageKey);
    if (persistedWishlist) {
      try {
        const parsed = JSON.parse(persistedWishlist);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      } catch (error) {
        console.warn('[Products] Could not parse wishlist from storage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters?.priceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= activeFilters.priceRange[0] &&
          product.price <= activeFilters.priceRange[1]
      );
    }

    if (activeFilters?.category) {
      filtered = filtered.filter((product) => product.category === activeFilters.category);
    }

    if (activeFilters?.brand && activeFilters.brand.length > 0) {
      filtered = filtered.filter((product) => product.brand && activeFilters.brand.includes(product.brand));
    }

    if (activeFilters?.rating) {
      filtered = filtered.filter((product) => (product.rating || 0) >= activeFilters.rating);
    }

    if (activeFilters?.inStock) {
      filtered = filtered.filter((product) => (product.inventory_quantity ?? product.inventory ?? 0) > 0);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, activeFilters]);

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const handleWishlistToggle = (productId: string) => {
    const isAdded = !wishlist.includes(productId);
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    setSnackbarMessage(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const formatPrice = (price: number | string) => {
    const parsed = typeof price === 'string' ? parseFloat(price) : price;
    return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <LoadingSkeleton count={12} />
        </Box>
      </Container>
    );
  }

  const maxPrice = Math.max(...products.map(p => p.price), 1000);
  const searchSuggestions = products.slice(0, 40).map((p) => p.name);
  const wishlistCount = wishlist.length;

  const mainContent = (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          All Products
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6" color="text.secondary">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
          </Typography>
          <Typography variant="h6" color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <FavoriteIcon fontSize="small" />
            {wishlistCount} Saved
          </Typography>
        </Stack>
      </Box>

      {/* Search and Controls */}
      <Paper
        variant="outlined"
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 280 } }}>
          <SearchBar
            onSearch={setSearchQuery}
            suggestions={searchSuggestions}
            placeholder="Search luxury products..."
          />
        </Box>
        
        <FormControl sx={{ minWidth: 170 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="name">Name: A-Z</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('grid')}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            <ViewModuleIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            color={viewMode === 'list' ? 'primary' : 'default'}
          >
            <ViewListIcon />
          </IconButton>
        </Box>

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setFilterDrawerOpen(true)}
        >
          Filters
        </Button>
      </Paper>

      {/* Products Grid */}
      <Grid container spacing={viewMode === 'list' ? 2 : 4}>
        {filteredProducts.map((product) => (
          <Grid 
            size={{
              xs: 12,
              sm: viewMode === 'list' ? 12 : 6,
              md: viewMode === 'list' ? 12 : 4,
              lg: viewMode === 'list' ? 12 : 3
            }}
            key={product.id}
          >
            <ProductCard
              product={product}
              onAddToCart={addItem}
              onToggleWishlist={handleWishlistToggle}
              isInWishlist={wishlist.includes(product.id)}
              onQuickView={(selectedProduct) => setQuickViewProduct(selectedProduct)}
              variant={viewMode}
            />
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found matching your criteria.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('');
              setSortBy('featured');
              setActiveFilters(null);
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {mainContent}
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 300 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterPanel
          onFilterChange={handleFilterChange}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          maxPrice={maxPrice}
        />
      </Drawer>

      <Dialog
        open={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        fullWidth
        maxWidth="md"
      >
        {quickViewProduct && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>{quickViewProduct.name}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    component="img"
                    src={quickViewProduct.imageUrl || '/images/placeholder.svg'}
                    alt={quickViewProduct.name}
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      objectFit: 'cover',
                      maxHeight: 360,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    ${formatPrice(quickViewProduct.price)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {quickViewProduct.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      Category: <strong>{quickViewProduct.category}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Brand: <strong>{quickViewProduct.brand || 'Boutique Select'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Stock:{' '}
                      <strong>
                        {(quickViewProduct.inventory_quantity ?? quickViewProduct.inventory ?? 0) > 0
                          ? 'In Stock'
                          : 'Out of Stock'}
                      </strong>
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setQuickViewProduct(null)}>Close</Button>
              <Button
                variant="outlined"
                onClick={() => handleWishlistToggle(quickViewProduct.id)}
              >
                {wishlist.includes(quickViewProduct.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
              </Button>
              <Button
                variant="contained"
                onClick={() => addItem(quickViewProduct)}
                disabled={(quickViewProduct.inventory_quantity ?? quickViewProduct.inventory ?? 0) <= 0}
              >
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={2200}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarMessage('')} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;