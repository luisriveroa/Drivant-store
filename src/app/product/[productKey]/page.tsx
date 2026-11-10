'use client';

import React, { useEffect, useState } from 'react';
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
  AlertTriangle,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ProductBrandIcon from '@/components/ProductBrandIcon';
import ProductCover from '@/components/ProductCover';
import { toast } from 'sonner';
import type { ResaleProduct, ResaleVariant } from '@/lib/types';

const sectionTitle = 'mb-2 text-sm font-bold text-gray-900 dark:text-white';

export default function ProductDetailPage({
  params,
}: {
  params: { productKey: string };
}) {
  const router = useRouter();
  const productKey = decodeURIComponent(params?.productKey || '');

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
          throw new Error(res.status === 404 ? 'Este producto ya no está disponible.' : 'No pudimos cargar este producto.');
        }
        const data: ResaleProduct = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'No pudimos cargar este producto.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productKey]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf9] dark:bg-[#0c0d10]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] bg-[#fafaf9] px-4 py-16 text-center dark:bg-[#0c0d10]">
        <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Producto no encontrado</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">{error || 'No pudimos cargar este producto.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-lime-300"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.minPrice;
  const inStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const { info } = product;
  const variantWarrantyDays = selectedVariant?.warranty?.durationDays;
  const warranty = variantWarrantyDays ? `${variantWarrantyDays} días` : info.warranty;

  const facts = [
    { label: 'Duración', value: selectedVariant?.name || info.duration, Icon: Clock },
    { label: 'Garantía', value: warranty, Icon: ShieldCheck },
    { label: 'Entrega', value: info.delivery, Icon: PackageCheck },
  ];

  const handleAddToCart = () => {
    addItem({
      productKey: product.productKey,
      variantKey: selectedVariant?.variantKey || null,
      productName: product.name,
      variantName: selectedVariant?.name,
      quantity,
      resalePrice: currentPrice,
    });
    toast.success(`${product.name} se agregó al carrito`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="bg-[#fafaf9] dark:bg-[#0c0d10]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_340px]">
          {/* Product info: same structure for every product */}
          <div className="min-w-0">
            <div className="mb-6">
              <ProductCover
                logo={product.logo}
                brandName={product.brandName}
                brandColor={product.brandColor}
                size="lg"
              />
            </div>
            <div className="mb-4 flex items-center gap-3">
              <ProductBrandIcon logo={product.logo} brandName={product.brandName} size="lg" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
                  {product.brandName}
                </span>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <Badge variant="info">{product.category}</Badge>
                  {inStock ? <Badge variant="success">Disponible</Badge> : <Badge variant="danger">Agotado</Badge>}
                </div>
              </div>
            </div>

            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {product.name}
            </h1>
            <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">{product.description}</p>

            <dl className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {facts.map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>

            {info.includes.length > 0 && (
              <section className="mb-6">
                <h2 className={sectionTitle}>Qué incluye</h2>
                <ul className="space-y-1.5">
                  {info.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.deliverFields && product.deliverFields.length > 0 && (
              <section className="mb-6">
                <h2 className={sectionTitle}>Qué recibes</h2>
                <ul className="space-y-1.5">
                  {product.deliverFields.map((field) => (
                    <li key={field.name} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" aria-hidden="true" />
                      {field.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {info.steps.length > 0 && (
              <section className="mb-6">
                <h2 className={sectionTitle}>Cómo se activa</h2>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm text-gray-700 marker:font-bold dark:text-gray-300">
                  {info.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
            )}

            {info.notes.length > 0 && (
              <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Importante
                </h2>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-amber-900 dark:text-amber-100">
                  {info.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </section>
            )}

            {!info.hasDetails && (
              <p className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                Pregúntanos por chat los detalles de este producto antes de pagar.
              </p>
            )}

            {product.brandAbout && (
              <section className="mb-6">
                <h2 className={sectionTitle}>Sobre {product.brandName}</h2>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{product.brandAbout}</p>
              </section>
            )}

            <section>
              <h2 className={sectionTitle}>Cómo comprar</h2>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-gray-700 marker:font-bold dark:text-gray-300">
                <li>Agrega el producto a tu carrito.</li>
                <li>Envía tu pedido por WhatsApp o Telegram.</li>
                <li>Te pasamos el método de pago por el chat.</li>
                <li>Recibes tu producto cuando confirmamos el pago.</li>
              </ol>
            </section>
          </div>

          {/* Purchase box */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:sticky md:top-20">
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Elige una opción
                </span>
                <div className="space-y-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.variantKey === v.variantKey;
                    return (
                      <button
                        key={v.variantKey}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                          isSelected
                            ? 'border-lime-500 bg-lime-50 ring-1 ring-lime-500 dark:bg-lime-950/30'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{v.name}</span>
                        <span className="text-right">
                          <span className="block text-base font-bold text-gray-900 dark:text-white">
                            US$ {v.price.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            {v.inStock ? 'Disponible' : 'Agotado'}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Cantidad (máximo 50)
              </span>
              <div className="flex w-fit items-center rounded-xl border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  aria-label="Quitar una unidad"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-l-xl p-2.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
                <button
                  type="button"
                  aria-label="Agregar una unidad"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="rounded-r-xl p-2.5 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-baseline justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-300">Total en dólares</span>
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                US$ {(currentPrice * quantity).toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full justify-center" onClick={handleBuyNow} disabled={!inStock}>
                <Zap className="h-4 w-4" aria-hidden="true" />
                {inStock ? 'Comprar ahora' : 'Agotado'}
              </Button>
              <Button variant="secondary" size="lg" className="w-full justify-center" onClick={handleAddToCart} disabled={!inStock}>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
