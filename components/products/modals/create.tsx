'use client'

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, Settings } from "lucide-react"
import { handleCreteProduct } from "@/app/actions/products/createProduct"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface CreateProductDialogProps {
  onCreateSuccess: () => void
}

export const Create = ({ onCreateSuccess }: CreateProductDialogProps) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState<boolean>(false)
  const [sellingPrice, setSellingPrice] = useState<number>(1)
  const [purchasePrice, setPurchasePrice] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const profit = sellingPrice - purchasePrice

  const submitForm = async (formData: FormData) => {
    if (error !== null)
      return

    startTransition(async () => {
      await handleCreteProduct(formData)
      setOpen(false)
      onCreateSuccess()
    })
  }

  useEffect(() => {
    if (purchasePrice >= sellingPrice)
      setError("O valor de compra deve ser menor que o valor de venda.")
    else
      setError(null)
  }, [purchasePrice, sellingPrice])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mb-1 hover:cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto w-[90%]" removeClose={isPending}>
        {
          isPending ? (
            <div className="m-auto p-10">
              <Loader2 className="animate-spin" height={50} width={50} />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
              </DialogHeader>
              <form action={submitForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Nome</label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 w-full border px-3 py-2 rounded"
                    defaultValue=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Preço de compra</label>
                  <input
                    type="number"
                    name="purchasePrice"
                    required
                    className={`mt-1 w-full border px-3 py-2 rounded ${error ? 'border-red-500 focus:outline-red-500' : ''}`}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                      {error}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Preço de venda</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    required
                    min={1}
                    className="mt-1 w-full border px-3 py-2 rounded"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Lucro</label>
                  <input
                    type="text"
                    className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                    value={profit !== null ? `R$ ${profit.toFixed(2).replace('.', ',')}` : ''}
                    readOnly
                  />
                  <input type="hidden" name="profit" value={profit ?? ''} />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="opcionais">
                    <AccordionTrigger className="px-4 py-3 text-base font-semibold bg-muted hover:bg-muted/70 rounded-t-md flex items-center gap-2 hover:cursor-pointer">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Campos opcionais
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Quantidade em estoque</label>
                        <input
                          type="number"
                          name="quantity"
                          className="mt-1 w-full border px-3 py-2 rounded"
                          defaultValue={0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <input
                          type="text"
                          name="description"
                          className="mt-1 w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Unidade de Medida</label>
                        <select
                          name="unitMeasure"
                          className="mt-1 w-full border px-3 py-2 rounded"
                          defaultValue="UN"
                        >
                          <option value="UN">Unidade (UN)</option>
                          <option value="KG">Quilograma (KG)</option>
                          <option value="G">Grama (G)</option>
                          <option value="L">Litro (L)</option>
                          <option value="ML">Mililitro (ML)</option>
                          <option value="CM">Centímetro (CM)</option>
                          <option value="MM">Milímetro (MM)</option>
                          <option value="M2">Metro quadrado (M²)</option>
                          <option value="M3">Metro cúbico (M³)</option>
                          <option value="PCT">Pacote (PCT)</option>
                          <option value="DZ">Dúzia (DZ)</option>
                          <option value="CX">Caixa (CX)</option>
                          <option value="SC">Saco (SC)</option>
                          <option value="T">Tonelada (T)</option>
                        </select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit" disabled={isPending}>
                    Criar
                  </Button>
                  <Button type="button" onClick={() => setOpen(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </form>
            </>
          )
        }
      </DialogContent >
    </Dialog >
  )
}
