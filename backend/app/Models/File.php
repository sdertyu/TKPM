<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class File
 * 
 * @property int $FileID
 * @property string $Path
 * @property int $Size
 * @property Carbon|null $CreatedAt
 * 
 * @property Collection|Song[] $songs
 *
 * @package App\Models
 */
class File extends Model
{
	protected $table = 'File';
	protected $primaryKey = 'FileID';
	public $timestamps = false;

	protected $casts = [
		'Size' => 'int',
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Path',
		'Size',
		'CreatedAt'
	];

	public function songs()
	{
		return $this->hasMany(Song::class, 'FileID');
	}
}
