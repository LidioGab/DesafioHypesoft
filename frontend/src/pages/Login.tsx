export default function LoginPage() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="card w-full max-w-sm p-6">
				<div className="text-center mb-6">
					<div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] mx-auto mb-2" />
					<h1 className="text-lg font-semibold">Entrar</h1>
					<p className="text-sm text-gray-500">Acesse sua conta para continuar</p>
				</div>
				<form className="space-y-3">
					<div>
						<label className="block text-sm text-gray-600 mb-1">Email</label>
						<input type="email" className="w-full border rounded-lg px-3 py-2" placeholder="seu@email.com" />
					</div>
					<div>
						<label className="block text-sm text-gray-600 mb-1">Senha</label>
						<input type="password" className="w-full border rounded-lg px-3 py-2" placeholder="••••••••" />
					</div>
					<button type="button" className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2">Entrar</button>
				</form>
				<p className="text-xs text-gray-500 mt-4 text-center">Em breve: login via Keycloak</p>
			</div>
		</div>
	)
}
