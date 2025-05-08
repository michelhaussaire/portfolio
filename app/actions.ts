"use server"

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactFormData) {
  // Simulamos un retraso para mostrar el estado de carga
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Aquí iría la lógica real para enviar el email
  // Por ejemplo, usando un servicio como SendGrid, Mailgun, etc.

  console.log("Email enviado:", data)

  // Si todo va bien, retornamos true
  // Si hubiera un error, lanzaríamos una excepción
  return true
}
