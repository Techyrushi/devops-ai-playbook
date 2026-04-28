import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Fade,
  Slide,
  Chip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Verified as VerifiedIcon,
  SupportAgent as SupportAgentIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      console.log('[Home] Loading products...');
      try {
        const featuredProducts = await productService.getAll();
        console.log('[Home] Got products:', featuredProducts.length);
        setProducts(featuredProducts.slice(0, 8));
      } catch (error) {
        console.error('[Home] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <LoadingSkeleton count={8} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2f517d 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Discover Timeless
                    <Box component="span" sx={{ color: '#f0d29b' }}>
                      {' '}Elegance
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      mb: 4,
                      lineHeight: 1.6,
                      fontWeight: 300,
                      opacity: 0.9,
                    }}
                  >
                    Indulge in our curated collection of luxury products, 
                    where sophistication meets exceptional quality.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Authenticity Guaranteed"
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
                      variant="outlined"
                    />
                    <Chip
                      icon={<SupportAgentIcon />}
                      label="24/7 Concierge Support"
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ShoppingBagIcon />}
                      href="/products"
                      sx={{
                        backgroundColor: '#f0d29b',
                        color: '#142943',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#d9a441',
                        },
                      }}
                    >
                      Shop Collection
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      href="#featured"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      Explore More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide in timeout={1500} direction="right">
                <Box
                  sx={{
                    height: { xs: 300, md: 400 },
                    background: 'linear-gradient(45deg, #d9a441 0%, #f0d29b 100%)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#142943',
                      textAlign: 'center',
                      p: 4,
                    }}
                  >
                    LUXURY
                    <br />
                    REDEFINED
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          sx={{
            mt: -4,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {[
            { label: 'Happy Customers', value: '25K+' },
            { label: 'Premium Brands', value: '160+' },
            { label: 'Countries Delivered', value: '40+' },
            { label: 'Average Rating', value: '4.9/5' },
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  textAlign: 'center',
                  height: '100%',
                }}
              >
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8, mt: { xs: 1, md: 2 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <ShippingIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over $500
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure transactions
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <StarIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Premium Quality
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carefully selected products
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <RefreshIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Easy Returns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30-day return policy
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Curated Collections */}
      <Container maxWidth="lg">
        <Box sx={{ pb: 8 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Curated Collections
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore trend-focused edits handcrafted by our stylists.
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: 'Executive Essentials',
                description: 'Refined looks for boardroom confidence.',
                tone: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              },
              {
                title: 'Weekend Statements',
                description: 'Relaxed luxury for modern lifestyles.',
                tone: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
              },
              {
                title: 'Evening Signature',
                description: 'Bold pieces designed to stand out.',
                tone: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
              },
            ].map((collection) => (
              <Grid key={collection.title} size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    color: 'white',
                    background: collection.tone,
                    minHeight: 210,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {collection.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {collection.description}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    href="/products"
                    sx={{
                      alignSelf: 'flex-start',
                      mt: 2,
                      borderColor: 'rgba(255,255,255,0.6)',
                      color: 'white',
                    }}
                  >
                    Explore
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: '#eef2f8', py: 8 }} id="featured">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontFamily: '"Playfair Display", serif' }}
            >
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Discover our handpicked selection of luxury items
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={addItem}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              href="/products"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials and CTA */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={3}>
            {[
              {
                quote:
                  'The delivery was incredibly fast and the quality exceeded expectations.',
                name: 'Ava R.',
              },
              {
                quote:
                  'Feels like a premium in-store experience, but online and effortless.',
                name: 'Noah K.',
              },
            ].map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={testimonial.name}>
                <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    {[...Array(5)].map((_, starIndex) => (
                      <StarIcon
                        key={`${testimonial.name}-${starIndex}`}
                        sx={{ color: 'secondary.main', fontSize: 20 }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {testimonial.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper
            sx={{
              mt: 4,
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #1e3a5f 0%, #2f517d 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Ready to elevate your wardrobe?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Join thousands of customers discovering curated premium style daily.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              href="/register"
              sx={{
                backgroundColor: '#f0d29b',
                color: '#142943',
                '&:hover': { backgroundColor: '#d9a441' },
              }}
            >
              Create Account
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Home;