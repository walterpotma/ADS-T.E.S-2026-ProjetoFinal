using System;

namespace LocalNet.API.Models;

public class Usuario
{
    public string Id { get; set; } = Guid.NewGuid().ToString(); 
    public string? Nome { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
    public DateTime AtualizadoEm { get; set; }
}