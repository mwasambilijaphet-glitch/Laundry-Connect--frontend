import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/255768188065?text=Habari%2C%20nahitaji%20msaada%20na%20Laundry%20Connect"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Tupige Story!</span>
    </a>
  );
}
