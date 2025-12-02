<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CaregiverInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        private User $patient,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isExistingUser = $notifiable instanceof User && $notifiable->exists;
        $actionUrl = $isExistingUser
            ? $this->buildAcceptInvitationUrl()
            : $this->buildRegisterUrl($notifiable->email);

        $mail = (new MailMessage())
            ->subject('Convite para ser Cuidador - ' . config('app.name'))
            ->greeting('Olá!')
            ->line("Você foi convidado(a) por **{$this->patient->name}** para ser seu(sua) cuidador(a) no " . config('app.name') . '.')
            ->line('Como cuidador(a), você poderá acompanhar e auxiliar no gerenciamento dos medicamentos do paciente.');

        if ($isExistingUser) {
            $mail->line('Clique no botão abaixo para aceitar ou recusar o convite:')
                ->action('Ver Convite', $actionUrl);
        } else {
            $mail->line('Para aceitar o convite, você precisa criar uma conta no ' . config('app.name') . ':')
                ->action('Criar Conta e Aceitar', $actionUrl);
        }

        return $mail
            ->line('**Informações importantes:**')
            ->line('• Você poderá gerenciar as permissões de acesso a qualquer momento')
            ->line('• Se você não conhece esta pessoa, ignore este e-mail')
            ->salutation('Atenciosamente, Equipe ' . config('app.name'));
    }

    private function buildAcceptInvitationUrl(): string
    {
        $baseUrl = config('app.url');

        return "{$baseUrl}/my-patients";
    }

    private function buildRegisterUrl(string $email): string
    {
        $baseUrl = config('app.url');
        $safeEmail = urlencode($email);

        return "{$baseUrl}/register?email={$safeEmail}&role=caregiver";
    }
}
