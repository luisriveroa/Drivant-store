'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ProductBrandIcon, { detectBrand } from '@/components/ProductBrandIcon';
import { toast } from 'sonner';
import type { ResaleProduct, ResaleVariant } from '@/lib/types';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productKey: string }>;
}) {
  const router = useRouter();
  const { productKey } = use(params);

  const [product, setProduct] = useState<ResaleProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ResaleVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productKey)}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        const data: ResaleProduct = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error loading product');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productKey]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'Unable to load product information.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.minPrice;
  const currentWarranty = selectedVariant?.warranty || product.warranty;
  const inStock = selectedVariant ? selectedVariant.inStock : product.inStock;

  const handleAddToCart = () => {
    addItem({
      productKey: product.productKey,
      variantKey: selectedVariant?.variantKey || null,
      productName: product.name,
      variantName: selectedVariant?.name || 'Standard',
      quantity,
      resalePrice: currentPrice,
    });
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left Column: Details */}
        <div>
          {/* Brand Icon & Category Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-200 p-2.5 shadow-sm">
              <ProductBrandIcon
                productKey={product.productKey}
                name={product.name}
                category={product.category}
                size="lg"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-lime-600">
                {detectBrand(`${product.productKey} ${product.name}`).label}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="info">{product.category || 'Digital'}</Badge>
                {inStock ? (
                  <Badge variant="success">In Stock</Badge>
                ) : (
                  <Badge variant="danger">Out of Stock</Badge>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            {product.name}
          </h1>

          <div className="prose prose-sm text-gray-600 mb-6">
            <p className="whitespace-pre-line leading-relaxed">
              {product.description || 'Instant digital delivery upon successful purchase.'}
            </p>
          </div>

          {/* Delivery Fields Information */}
          {product.deliverFields && product.deliverFields.length > 0 && (
            <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
              <div className="flex items-center gap-2 text-brand-900 font-semibold text-sm mb-2">
                <PackageCheck className="h-4 w-4 text-brand-600" />
                Delivered Goods Upon Purchase:
              </div>
              <ul className="space-y-1">
                {product.deliverFields.map((field, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-brand-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{field.label} ({field.name})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warranty Details */}
          {currentWarranty && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 mb-6">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">
                  {currentWarranty.durationDays > 0
                    ? `${currentWarranty.durationDays} Days Warranty Guarantee`
                    : 'Warranty Coverage'}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {currentWarranty.details || 'Full replacement warranty if issues arise.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Variant Selection & Purchasing */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Select Option / Duration
              </label>
              <div className="space-y-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.variantKey === v.variantKey;
                  return (
                    <button
                      key={v.variantKey}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full text-left rounded-xl border p-3.5 transition flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                        {v.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{v.description}</p>
                        )}
                        {v.warranty && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
                            <ShieldCheck className="h-3 w-3" />
                            {v.warranty.durationDays}d warranty
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-gray-900">
                          ${v.price.toFixed(2)}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {v.inStock ? 'Available' : 'Out of stock'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Quantity (Max 50)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-l-xl transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-r-xl transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">Units</span>
            </div>
          </div>

          {/* Price Calculation */}
          <div className="mb-6 border-t border-gray-100 pt-4 flex items-baseline justify-between">
            <span className="text-sm text-gray-500">Total Price</span>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-gray-900">
                ${(currentPrice * quantity).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 ml-1">USD</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              <Zap className="h-4 w-4" />
              {inStock ? 'Buy Now' : 'Out of Stock'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
