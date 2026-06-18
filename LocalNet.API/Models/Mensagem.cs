using System;
using LocalNet.API.Models;

namespace LocalNet.API.Models;

public class Mensagem
{
    public string? Id { get; set; } = Guid.NewGuid().ToString();
    public string UsuarioId { get; set; } = string.Empty;
    public Usuario? usuario { get; set; }
    public string GrupoId { get; set; } = string.Empty;
    public string? Text { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
    public DateTime AtualizadoEm { get; set; }
}