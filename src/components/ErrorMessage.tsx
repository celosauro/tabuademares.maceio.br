interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ 
  message = 'Falha ao carregar dados da tábua de marés. Tente novamente.' 
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="text-tide-600 text-lg font-medium mb-2">
          Ops! Algo deu errado
        </div>
        <p className="text-tide-500">{message}</p>
      </div>
    </div>
  );
}
