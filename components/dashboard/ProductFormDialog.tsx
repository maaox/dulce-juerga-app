"use client";

import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { useProducts } from "@/src/hooks/useProducts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSuccess?: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const { createProduct, updateProduct, loading } = useProducts();
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "CERVEZA",
    precioBase: "",
    costoUnitario: "",
    stockInicial: "",
    stockActual: "",
    unidadMedida: "UNIDAD",
    disponible: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || "",
        categoria: product.categoria,
        precioBase: product.precioBase.toString(),
        costoUnitario: product.costoUnitario.toString(),
        stockInicial: product.stockInicial.toString(),
        stockActual: product.stockActual.toString(),
        unidadMedida: product.unidadMedida,
        disponible: product.disponible,
      });
      setImagePreview(product.imagenUrl || null);
    } else {
      // Reset form
      setFormData({
        nombre: "",
        descripcion: "",
        categoria: "CERVEZA",
        precioBase: "",
        costoUnitario: "",
        stockInicial: "",
        stockActual: "",
        unidadMedida: "UNIDAD",
        disponible: true,
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("categoria", formData.categoria);
    data.append("precioBase", formData.precioBase);
    data.append("costoUnitario", formData.costoUnitario);
    data.append("stockInicial", formData.stockInicial);
    data.append("stockActual", formData.stockActual);
    data.append("unidadMedida", formData.unidadMedida);
    data.append("disponible", formData.disponible.toString());

    if (imageFile) {
      data.append("imagen", imageFile);
    }

    const result = isEdit
      ? await updateProduct(product!.id, data)
      : await createProduct(data);

    if (result) {
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica la información del producto"
              : "Completa los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen */}
          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG o WEBP. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Cerveza Pilsen"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción del producto"
                rows={2}
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoria: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CERVEZA">Cerveza</SelectItem>
                  <SelectItem value="TRAGO">Trago</SelectItem>
                  <SelectItem value="SHOT">Shot</SelectItem>
                  <SelectItem value="SIN_ALCOHOL">Sin Alcohol</SelectItem>
                  <SelectItem value="OTRO">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Unidad de Medida */}
            <div className="space-y-2">
              <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
              <Select
                value={formData.unidadMedida}
                onValueChange={(value) =>
                  setFormData({ ...formData, unidadMedida: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNIDAD">Unidad</SelectItem>
                  <SelectItem value="BOTELLA">Botella</SelectItem>
                  <SelectItem value="LITRO">Litro</SelectItem>
                  <SelectItem value="ML">ML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio Base */}
            <div className="space-y-2">
              <Label htmlFor="precioBase">Precio de Venta (S/) *</Label>
              <Input
                id="precioBase"
                type="number"
                step="0.01"
                value={formData.precioBase}
                onChange={(e) =>
                  setFormData({ ...formData, precioBase: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            {/* Costo Unitario */}
            <div className="space-y-2">
              <Label htmlFor="costoUnitario">Costo Unitario (S/) *</Label>
              <Input
                id="costoUnitario"
                type="number"
                step="0.01"
                value={formData.costoUnitario}
                onChange={(e) =>
                  setFormData({ ...formData, costoUnitario: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            {/* Stock Inicial */}
            <div className="space-y-2">
              <Label htmlFor="stockInicial">Stock Inicial *</Label>
              <Input
                id="stockInicial"
                type="number"
                value={formData.stockInicial}
                onChange={(e) =>
                  setFormData({ ...formData, stockInicial: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            {/* Stock Actual */}
            <div className="space-y-2">
              <Label htmlFor="stockActual">Stock Actual *</Label>
              <Input
                id="stockActual"
                type="number"
                value={formData.stockActual}
                onChange={(e) =>
                  setFormData({ ...formData, stockActual: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            {/* Disponible */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch
                id="disponible"
                checked={formData.disponible}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, disponible: checked })
                }
              />
              <Label htmlFor="disponible" className="cursor-pointer">
                Producto disponible para venta
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : isEdit
                ? "Actualizar"
                : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
