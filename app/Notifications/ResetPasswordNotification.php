<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        #[\SensitiveParameter] private string $token,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Solicitação de Redefinição de Senha - ' . config('app.name'))
            ->greeting('Olá, ' . $notifiable->name . '!')
            ->line('Recebemos uma solicitação para redefinir a senha da sua conta no ' . config('app.name') . '.')
            ->line('Para prosseguir com a redefinição, clique no botão abaixo:')
            ->action('Redefinir Minha Senha', $this->buildResetPasswordUrl($notifiable))
            ->line('**Informações importantes:**')
            ->line('• Este link é válido por 60 minutos')
            ->line('• Se você não solicitou esta redefinição, ignore este e-mail')
            ->line('• Por segurança, nunca compartilhe este link com terceiros')
            ->line('• Caso tenha dúvidas, entre em contato com o suporte')
            ->salutation('Atenciosamente, Equipe ' . config('app.name'));
    }

    private function buildResetPasswordUrl(object $notifiable): string
    {
        $baseUrl = config('app.url');

        $safeToken = urlencode($this->token);

        $safeEmail = urlencode($notifiable->email);

        $url = "{$baseUrl}/reset-password?token={$safeToken}&email={$safeEmail}";

        return $url;
    }
}
