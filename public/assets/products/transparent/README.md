# Product Photography

The atelier showroom (`src/components/ProductsSection.tsx`) reads one square image per product from
the `PRODUCT_PHOTO` map. The default assets live in the parent folder and are studio photographs of
each bottle on a dark stone block against a warm brown backdrop.

Because the showroom feathers every photograph's edges into the dark walnut vitrine, those opaque
studio frames read as product scenes inside the installation: the photographed stone base meets the
travertine ledge, and no card border or frame is visible.

## Swapping in transparent cut-outs

Drop a transparent square PNG or WebP here using the same framing (product centered, base near the
bottom edge) and point that product's entry at it:

```ts
'matte-molding-hair-clay': '/assets/products/transparent/matte-clay.webp',
```

The same stage, hover lift, contact shadow and flying-to-bag animation then render the bottle as a
free-standing object above the ledge. Keep the composition centered — the stage crops the outer
edges and feathers the top and sides.
