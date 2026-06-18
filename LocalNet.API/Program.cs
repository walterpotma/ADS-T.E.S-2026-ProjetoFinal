using LocalNet.API.Data;
using LocalNet.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDataContext>();

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapGet("/", () => "API do LocalNet Messenger - Módulo de Usuários!");

app.MapGet("/api/usuario/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Usuarios.Any())
    {
        return Results.Ok(ctx.Usuarios.ToList());
    }

    return Results.NotFound("Nenhum usuário cadastrado.");
});

app.MapGet("/api/usuario/buscar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    foreach (Usuario u in ctx.Usuarios.ToList())
    {
        if (u.Id == id)
        {
            return Results.Ok(u);
        }
    }
    return Results.NotFound("Usuário não encontrado.");
});

app.MapPost("/api/usuario/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Usuario usuario) =>

{
    foreach (Usuario u in ctx.Usuarios.ToList())
    {
        if (u.Nome == usuario.Nome)
        {
            return Results.BadRequest("Já existe um usuário com esse nome.");
        }
    }

    ctx.Usuarios.Add(usuario);
    ctx.SaveChanges();
    return Results.Created("", usuario);
});

app.MapPut("/api/usuario/atualizar/{id}", ([FromBody] Usuario usuarioAtualizado, [FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    foreach (Usuario u in ctx.Usuarios.ToList())
    {
        if (u.Id == id)
        {
            u.Nome = usuarioAtualizado.Nome;
            u.Email = usuarioAtualizado.Email;
            u.Telefone = usuarioAtualizado.Telefone;
            u.AtualizadoEm = DateTime.Now;

            ctx.Usuarios.Update(u);
            ctx.SaveChanges();
            return Results.Ok(u);
        }
    }
    return Results.NotFound("Usuário não encontrado.");
});

app.MapDelete("/api/usuario/deletar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    foreach (Usuario u in ctx.Usuarios.ToList())
    {
        if (u.Id == id)
        {
            ctx.Usuarios.Remove(u);
            ctx.SaveChanges();
            return Results.Ok("Usuário deletado.");
        }
    }
    return Results.NotFound("Usuário não encontrado.");
});

app.MapPost("/api/usuario/entrar-grupo", ([FromServices] AppDataContext ctx, [FromBody] UsuarioGrupo ligacao) =>
{
    ctx.UsuarioGrupos.Add(ligacao);
    ctx.SaveChanges();
    return Results.Created("", ligacao);
});

app.MapGet("/api/mensagem/listar/{grupoId}", ([FromServices] AppDataContext ctx, [FromRoute] string grupoId) =>
{
    var mensagens = ctx.Mensagens
        .Where(m => m.GrupoId == grupoId)
        .Select(m => new
        {
            m.Id,
            m.Text,
            m.GrupoId,
            m.UsuarioId,
            m.CriadoEm,
            m.AtualizadoEm,
            usuario = ctx.Usuarios.FirstOrDefault(u => u.Id == m.UsuarioId)
        })
        .ToList();

    if (mensagens.Any())
    {
        return Results.Ok(mensagens);
    }

    return Results.NotFound("Nenhuma mensagem encontrada");
});

app.MapPost("/api/mensagem/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Mensagem mensagem) =>
{
    ctx.Mensagens.Add(mensagem);
    ctx.SaveChanges();
    return Results.Created();
});

app.MapPut("/api/mensagem/atualizar/{mensagemId}", ([FromServices] AppDataContext ctx, [FromBody] Mensagem mensagem, [FromRoute] string mensagemId) =>
{

    foreach (Mensagem m in ctx.Mensagens.ToList())
    {
        if (m.Id == mensagemId)
        {
            m.Text = mensagem.Text;
            m.AtualizadoEm = DateTime.Now;

            ctx.Mensagens.Update(m);
            ctx.SaveChanges();
            return Results.Ok(m);
        }
    }
    return Results.NotFound("Mensagem não encontrada");
});

app.MapDelete("/api/mensagem/deletar/{mensagemId}", ([FromServices] AppDataContext ctx, [FromRoute] string mensagemId) =>
{
    foreach (Mensagem m in ctx.Mensagens.ToList())
    {
        if (m.Id == mensagemId)
        {
            ctx.Mensagens.Remove(m);
            ctx.SaveChanges();
            return Results.Ok("Mensagem deletada.");
        }
    }
    return Results.NotFound("Mensagem não encontrada");
});
app.MapGet("/api/grupo", ([FromServices] AppDataContext ctx) =>
{
    var grupos = ctx.Grupos.ToList();

    if (grupos.Any())
    {
        return Results.Ok(grupos);
    }
    return Results.NotFound("Nenhum grupo encontrado");
});

app.MapGet("/api/grupo/buscar/{grupoId}", ([FromServices] AppDataContext ctx, [FromRoute] string grupoId) =>
{
   foreach (Grupo g in ctx.Grupos.ToList())
    {
        if (g.Id == grupoId)
        {
            return Results.Ok(g);
        }
        
    }
    return Results.NotFound("Grupo não encotrado! ");
});


app.MapPost("/api/grupo/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Grupo grupo) =>
{
    foreach (Grupo g in ctx.Grupos.ToList())
    {
        if (g.Nome == grupo.Nome)
        {
            return Results.BadRequest("Já existe um grupo com esse nome.");
        }
    }
    
    ctx.Grupos.Add(grupo);
    ctx.SaveChanges();

    return Results.Created("", grupo);
});


app.MapPut("/api/grupo/atualizar/{id}", ([FromBody] Grupo grupoAtualizado, [FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    foreach (Grupo u in ctx.Grupos.ToList())
    {
        if (u.Id == id)
        {
            u.Nome = grupoAtualizado.Nome;
            u.Descricao = grupoAtualizado.Descricao;
            
            u.AtualizadoEm = DateTime.Now;

            ctx.Grupos.Update(u);
            ctx.SaveChanges();
            return Results.Ok(u);
        }
    }
    return Results.NotFound("Grupo não encontrado.");
});

app.MapDelete("/api/grupo/deletar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    foreach (Grupo u in ctx.Grupos.ToList())
    {
        if (u.Id == id)
        {
            ctx.Grupos.Remove(u);
            ctx.SaveChanges();
            return Results.Ok("grupo deletado.");
        }
    }
    return Results.NotFound("Grupo não encontrado.");
});

app.MapGet("/api/usuario/listar-por-grupo/{grupoId}", ([FromRoute] string grupoId, [FromServices] AppDataContext ctx) =>
{
    ArrayList usuariosDoGrupo = new ArrayList();

    foreach(UsuarioGrupo ligacao in ctx.UsuarioGrupos.ToList())
    {
        if(ligacao.GrupoId == grupoId)
        {
            usuariosDoGrupo.Add(ligacao.UsuarioId);
        }
    }

    foreach (string usuarioId in usuariosDoGrupo)
    {
        foreach (Usuario u in ctx.Usuarios.ToList())
        {
            if (u.Id == usuarioId)
            {
                return Results.Ok(u);
            }
        }
    }

    return Results.NotFound("Nenhum usuário encontrado para este grupo.");
});

app.Run();